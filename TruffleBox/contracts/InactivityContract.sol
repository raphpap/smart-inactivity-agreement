pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

contract InactivityContract is ChainlinkClient {
  address constant public outgoingAddress = 0x31DAF11283dba5DB6029f465924e1528dFf35c5f;
  uint256 constant public latestPost = 1459289773000;
  address public clientAddress;
  uint256 public clientEndAt;
  uint256 public clientLatestSaved;

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

  function requestUptime(
    address _oracle,
    bytes32 _jobId,
    uint256 _payment,
    address _clientAddress,
    string _clientFbId,
    string _encryptedFbAccessToken
  )
    public
    payable
    returns (bytes32 requestId)
  {
    clientAddress = _clientAddress;

    Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
    req.add("copyPath", "latest");
    req.add("clientId", _clientFbId);
    req.add("encryptedAccessToken", _encryptedFbAccessToken);

    requestId = sendChainlinkRequestTo(_oracle, req, _payment);
  }

  function fulfill(bytes32 _requestId, uint256 _latestActivity)
    public
    recordChainlinkFulfillment(_requestId)
  {
    if (clientLatestSaved == 0) { // First time fulfilling for this client
      clientEndAt = block.timestamp.add(5 minutes);
      clientLatestSaved = _latestActivity;
    }

    if (_latestActivity > latestPost) { // user has more recent activity
     outgoingAddress.transfer(address(this).balance); // he loses his collateral
    } else if (block.timestamp >= clientEndAt) { // contract is over
     clientAddress.transfer(address(this).balance); // he gets his balance back
    }
  }
}
