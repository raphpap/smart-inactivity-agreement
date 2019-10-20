pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";
import "chainlink/contracts/interfaces/AggregatorInterface.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title MyContract is an example contract which requests data from
 * the Chainlink network
 * @dev This contract is designed to work on multiple networks, including
 * local test networks
 */
contract MyContract is ChainlinkClient, Ownable {
  uint256 constant private NUM_ORACLES = 5;

  address[NUM_ORACLES] private oracles = [
    0xc99B3D447826532722E41bc36e644ba3479E4365, // Chainlink
    0x1948C20CC492539968BB9b041F96D6556B4b7001, // Fiews
    0x83F00b902cbf06E316C95F51cbEeD9D2572a349a, // LinkPool
    0x4a3FBbB385b5eFEB4BC84a25AaADcD644Bd09721, // honeycomb.market
    0xa0BfFBdf2c440D6c76af13c30d9B320F9d2DeA6A  // Secure Data Links
  ];

  bytes32[NUM_ORACLES] private jobs = [
    bytes32("9f0406209cf64acda32636018b33de11"), // Chainlink
    bytes32("80fecd06d2e14c67a22cee5f9728e067"), // Fiews
    bytes32("c179a8180e034cf5a341488406c32827"), // LinkPool
    bytes32("9e4ac334bca643389460f47076f43a8b"), // honeycomb.market
    bytes32("e0fc58dc839a42808c3c51186f6f8381")  // Secure Data Links
  ];

  AggregatorInterface public ethReference = AggregatorInterface(0x0Be00A19538Fac4BE07AC360C69378B870c412BF);

  uint256 public data;

  /**
   * @notice Deploy the contract with a specified address for the LINK
   * and Oracle contract addresses
   * @dev Sets the storage for the specified addresses
   * @param _link The address of the LINK token contract
   */
  constructor(address _link) public {
    if (_link == address(0)) {
      setPublicChainlinkToken();
    } else {
      setChainlinkToken(_link);
    }
  }

  /**
   * @notice Returns the address of the LINK token
   * @dev This is the public implementation for chainlinkTokenAddress, which is
   * an internal method of the ChainlinkClient contract
   */
  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  /**
   * @notice Creates a request to the specified Oracle contract address
   * @dev This function ignores the stored Oracle contract address and
   * will instead send the request to the address specified
   * @param _oracle The Oracle contract address to send the request to
   * @param _jobId The bytes32 JobID to be executed
   * @param _url The URL to fetch data from
   * @param _path The dot-delimited path to parse of the response
   * @param _times The number to multiply the result by
   */
  function createRequestTo(
    address _oracle,
    bytes32 _jobId,
    uint256 _payment,
    string _url,
    string _path,
    int256 _times
  )
    public
    onlyOwner
    returns (bytes32 requestId)
  {
    Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
    req.add("get", _url);
    req.add("path", _path);
    req.addInt("times", _times);
    requestId = sendChainlinkRequestTo(_oracle, req, _payment);
  }

  /**
   * @notice The fulfill method from requests created by this contract
   * @dev The recordChainlinkFulfillment protects this function from being called
   * by anyone other than the oracle address that the request was sent to
   * @param _requestId The ID that was generated for the request
   * @param _data The answer provided by the oracle
   */
  function fulfill(bytes32 _requestId, uint256 _data)
    public
    recordChainlinkFulfillment(_requestId)
  {
    int256 currentPrice = ethReference.currentAnswer();
    data = uint256(currentPrice);
  }

  /**
   * @notice Allows the owner to withdraw any LINK balance on the contract
   */
  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  /**
   * @notice Call this method if no response is received within 5 minutes
   * @param _requestId The ID that was generated for the request to cancel
   * @param _payment The payment specified for the request to cancel
   * @param _callbackFunctionId The bytes4 callback function ID specified for
   * the request to cancel
   * @param _expiration The expiration generated for the request to cancel
   */
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }
}
