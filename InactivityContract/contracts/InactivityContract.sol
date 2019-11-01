pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

contract InactivityContract is ChainlinkClient {
  //address ORACLE = 0xa1de4e226648c15f4bd514219f054aafee4b78d8;
  //bytes32 JOB_ID = 0x3935316435306135643430383462666539613664623830373730626639666564;
  address ORACLE = 0xd59fe7bb8307601b91aa703e20ff6b12141f2c3e;
  bytes32 JOB_ID = 0x3430643865383162613931653461623762383039633630313439363332316261;
  uint256 PAYMENT = 1000000000000000000;

  struct FbUser {
    address clientAddress;
    uint256 clientBalance;
    uint256 clientEndAt;
    uint256 clientLatestSaved;
    bool activeContract;
    bool exists;
  }

  // Number of active users in the contract
  uint public nbActiveUsers = 0;
  // Mapping of requestId => clientFbId
  mapping (bytes32 => string) clientFbIdForRequestId;
  // List of clientFbIds
  string[] public fbUsers;
  // Mapping of clientFbId => FbUser
  mapping (string => FbUser) fbUserStructs;

  // Accessor to a single user
  function getFbUser(string clientFbId) public view returns(bool, uint256, uint256, uint256, bool) {
    FbUser u = fbUserStructs[clientFbId];
    return (u.exists, u.clientBalance, u.clientEndAt, u.clientLatestSaved, u.activeContract);
  }

  // Accessor to a single user
  function getContractBalance() public view returns(uint256) {
    return address(this).balance;
  }

  function createFbUser(
    string clientFbId,
    address clientAddress,
    uint clientBalance
  ) private {
    fbUserStructs[clientFbId].clientAddress = clientAddress;
    fbUserStructs[clientFbId].clientBalance = clientBalance;
    fbUserStructs[clientFbId].activeContract = false;
    fbUserStructs[clientFbId].exists = true;
    fbUsers.push(clientFbId);
  }

  constructor(address _link) public payable {
    if (_link == address(0)) {
      setPublicChainlinkToken();
    } else {
      setChainlinkToken(_link);
    }
  }

  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  function registerUser(
    string _clientFbId,
    string _encryptedFbAccessToken
  )
    public
    payable
    returns (bytes32 requestId)
  {
    require(fbUserStructs[_clientFbId].exists == false);
    require(msg.value > 0);

    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.fulfillRegistration.selector);
    req.add("copyPath", "latest");
    req.add("clientId", _clientFbId);
    req.add("encryptedAccessToken", _encryptedFbAccessToken);

    requestId = sendChainlinkRequestTo(ORACLE, req, PAYMENT);
    clientFbIdForRequestId[requestId] = _clientFbId;

    createFbUser(
      _clientFbId,
      msg.sender,
      msg.value
    );
  }

  function fulfillRegistration(bytes32 _requestId, uint256 _latestActivity)
    public
    recordChainlinkFulfillment(_requestId)
  {
    // Use the request id to retrive the user struct in 2 steps
    string clientFbId = clientFbIdForRequestId[_requestId];
    FbUser user = fbUserStructs[clientFbId];

    // Remove the clientFbIdForRequestId mapping since we don't need it anymore
    delete(clientFbIdForRequestId[_requestId]);

    // Store the rest of the info
    user.clientEndAt = block.timestamp.add(5 minutes);
    user.clientLatestSaved = _latestActivity;
    user.activeContract = true;
    nbActiveUsers++;
  }

  function updateUser(
    string _clientFbId,
    string _encryptedFbAccessToken
  )
    public
    returns (bytes32 requestId)
  {
    FbUser user = fbUserStructs[_clientFbId];
    require(user.exists == true);
    require(user.activeContract == true);

    Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, this, this.fulfillUpdate.selector);
    req.add("copyPath", "latest");
    req.add("clientId", _clientFbId);
    req.add("encryptedAccessToken", _encryptedFbAccessToken);

    requestId = sendChainlinkRequestTo(ORACLE, req, PAYMENT);
    clientFbIdForRequestId[requestId] = _clientFbId;
  }

  function fulfillUpdate(bytes32 _requestId, uint256 _latestActivity)
    public
    recordChainlinkFulfillment(_requestId)
  {
    // Use the request id to retrive the user struct in 2 steps
    string clientFbId = clientFbIdForRequestId[_requestId];
    FbUser user = fbUserStructs[clientFbId];

    // Remove the clientFbIdForRequestId mapping since we don't need it anymore
    delete(clientFbIdForRequestId[_requestId]);

    if (_latestActivity > user.clientLatestSaved) { // user has more recent activity
      user.activeContract = false;

      uint gainPerUser = user.clientBalance / nbActiveUsers; // his collateral is redistributed to active users

      for (uint i=0; i<fbUsers.length; i++) {
        if (fbUserStructs[fbUsers[i]].activeContract == true) {
          fbUserStructs[fbUsers[i]].clientBalance += gainPerUser;
        }
      }

      user.clientBalance = 0;
      // We decrement this number after redistributing so we don't risk a division by 0
      // The contract therefore always keep "one fraction" of the redistribution to itself
      nbActiveUsers--;
    } else if (block.timestamp >= user.clientEndAt) { // contract is over
      user.clientAddress.transfer(user.clientBalance); // he gets his balance back
      user.activeContract = false;
      user.clientBalance = 0;
      nbActiveUsers--;
    }
  }
}
