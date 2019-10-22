pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

contract InactivityContract is ChainlinkClient {
  uint256 constant public uptimeThreshold = 9999; // solhint-disable-line const-name-snakecase
  uint256 public endAt;
  address public client;
  address public serviceProvider;
  uint256 public data;

  constructor(address _link) public payable {
    endAt = block.timestamp.add(5 minutes);

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
    string _url,
    address _client,
    address _serviceProvider
  )
    public
    returns (bytes32 requestId)
  {
    client = _client;
    serviceProvider = _serviceProvider;

    Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
    req.add("get", _url);
    req.add("path", "ranking");
    req.addInt("times", 10000);
    requestId = sendChainlinkRequestTo(_oracle, req, _payment);
  }

  function fulfill(bytes32 _requestId, uint256 _data)
    public
    recordChainlinkFulfillment(_requestId)
  {
    data = _data;
    if (_data < uptimeThreshold) {
     client.transfer(address(this).balance);
    } else if (block.timestamp >= endAt) { // solhint-disable-line not-rely-on-time
     serviceProvider.transfer(address(this).balance);
    }
  }
}
