// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract PayPal {

    address public owner;

    constructor(){
        owner = msg.sender;
}

    struct request {
            address requestor;
            uint256 amount;
            string message;
            string name;
        }

    struct sendRecive{
        string action ;
        uint256 amount;
        string message;
        address otherPartyAddress;
        string otherPartyName;

    }

    struct username{
        string name;
        bool hasName;
    }    

    mapping (address => username) names;
    mapping (address => request[]) requests;
    mapping (address => sendRecive[]) history;

    function addName(string memory _name) public{
        username storage newUserName = names[msg.sender];
        newUserName.name = _name;
        newUserName.hasName = true;

    }

    function createRequest(address user,uint256 _amount , string memory _message) public {

        request memory newRequest;
        newRequest.requestor = msg.sender;
        newRequest.amount = _amount;
        newRequest.message = _message;

        if(names[msg.sender].hasName){
            newRequest.name = names[msg.sender].name;
        }
        requests[user].push(newRequest);
    }

    function payRequest(uint256 _request) public payable {
        
        require(_request < requests[msg.sender].length , "No Such Requests");
        request[] storage myRequests = requests[msg.sender];
        request storage payableRequest = myRequests[_request];

        uint256 toPay = payableRequest.amount * 1000000000000000000;
        require(msg.value == (toPay) , "Pay Correct Amount");

        payable(payableRequest.requestor).transfer(msg.value);

        addHistory(msg.sender , payableRequest.requestor , payableRequest.amount , payableRequest.message);


        myRequests[_request] = myRequests[myRequests.length - 1];
        myRequests.pop();  

    }

    function addHistory(address sender , address receiver, uint256 _amount, string memory _message) private {
        
        sendRecive memory newSend;
    newSend.action = "Send";
    newSend.amount = _amount;
    newSend.message = _message;
    newSend.otherPartyAddress = receiver;
    if(names[receiver].hasName){
        newSend.otherPartyName = names[receiver].name;
    }
    history[sender].push(newSend);

    sendRecive memory newReceive;
    newReceive.action = "Receive";
    newReceive.amount = _amount;
    newReceive.message = _message;
    newReceive.otherPartyAddress = sender;
    if(names[sender].hasName){
        newReceive.otherPartyName = names[sender].name;
    }
    history[receiver].push(newReceive);
    }

    //Get all requests sent to a User

function getMyRequests(address _user) public view returns(
         address[] memory, 
         uint256[] memory, 
         string[] memory, 
         string[] memory
){

        address[] memory addrs = new address[](requests[_user].length);
        uint256[] memory amnt = new uint256[](requests[_user].length);
        string[] memory msge = new string[](requests[_user].length);
        string[] memory nme = new string[](requests[_user].length);
        
        for (uint i = 0; i < requests[_user].length; i++) {
            request storage myRequests = requests[_user][i];
            addrs[i] = myRequests.requestor;
            amnt[i] = myRequests.amount;
            msge[i] = myRequests.message;
            nme[i] = myRequests.name;
        }
        
        return (addrs, amnt, msge, nme);        
         

}


//Get all historic transactions user has been apart of


    function getMyHistory(address _user) public view returns(sendRecive[] memory){
        return history[_user];
    }

    function getMyName(address _user) public view returns(username memory){
        return names[_user];
    }

}       