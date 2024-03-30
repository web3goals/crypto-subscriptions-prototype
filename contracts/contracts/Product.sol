// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @notice A contract that stores products and subsribers.
 */
contract Product is ERC721URIStorage {
    struct Params {
        uint paymentAmount;
        address paymentToken;
        uint paymentPeriod;
        uint balance;
    }

    uint private _nextTokenId;
    mapping(uint tokenId => Params params) private _params;
    mapping(uint tokenId => address[] subscriber) private _subscribers;
    mapping(uint tokenId => mapping(address subscriber => uint lastPaymentDate))
        private _payments;

    constructor() ERC721("Crypto Subscriptions - Product", "CSP") {}

    function create(
        uint paymentAmount,
        address paymentToken,
        uint paymentPeriod,
        string memory tokenURI
    ) public {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _params[tokenId] = Params(
            paymentAmount,
            paymentToken,
            paymentPeriod,
            0
        );
    }

    function subscribe(uint tokenId) public {
        // Check that the caller is not a subscriber
        require(!_isSubscriber(tokenId, msg.sender), "Already subscribed");
        // Save subscriber
        _subscribers[tokenId].push(msg.sender);
        // Make the first payment
        _makePayment(tokenId, msg.sender);
    }

    function processSubscribers() public {
        for (uint256 i = 0; i < _nextTokenId; i++) {
            _processSubscribers(i);
        }
    }

    function getNextTokenId() public view returns (uint nextTokenId) {
        return _nextTokenId;
    }

    function getParams(
        uint tokenId
    ) public view returns (Params memory params) {
        return _params[tokenId];
    }

    function getSubscribers(
        uint tokenId
    ) public view returns (address[] memory subscribers) {
        return _subscribers[tokenId];
    }

    function withdraw(uint tokenId) public {
        // Check owner and balance
        require(_ownerOf(tokenId) == msg.sender, "Not owner");
        require(_params[tokenId].balance > 0, "Balance is zero");
        // Send tokens
        IERC20(_params[tokenId].paymentToken).transfer(
            msg.sender,
            _params[tokenId].balance
        );
        // Update params
        _params[tokenId].balance = 0;
    }

    function _isSubscriber(
        uint tokenId,
        address subscriber
    ) internal view returns (bool isSubscriber) {
        for (uint256 i = 0; i < _subscribers[tokenId].length; i++) {
            if (_subscribers[tokenId][i] == subscriber) {
                return true;
            }
        }
        return false;
    }

    function _makePayment(uint tokenId, address subscriber) internal {
        // Check allowance
        if (
            IERC20(_params[tokenId].paymentToken).allowance(
                subscriber,
                address(this)
            ) < _params[tokenId].paymentAmount
        ) {
            return;
        }
        // Check balance
        if (
            IERC20(_params[tokenId].paymentToken).balanceOf(subscriber) <
            _params[tokenId].paymentAmount
        ) {
            return;
        }
        // Check last payment date
        if (
            block.timestamp - _payments[tokenId][subscriber] <
            _params[tokenId].paymentPeriod
        ) {
            return;
        }
        // Send tokens to this contract
        IERC20(_params[tokenId].paymentToken).transferFrom(
            subscriber,
            address(this),
            _params[tokenId].paymentAmount
        );
        // Update subscriber last payment date
        _payments[tokenId][subscriber] = block.timestamp;
        // Update product balance
        _params[tokenId].balance += _params[tokenId].paymentAmount;
        // Save payment in Tableland
        // TODO:
        // Send data to webhook
        // TODO:
    }

    function _processSubscribers(uint tokenId) internal {
        for (uint256 i = 0; i < _subscribers[tokenId].length; i++) {
            _makePayment(tokenId, _subscribers[tokenId][i]);
        }
    }
}
