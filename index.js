import { ethers } from "./ethers-5.6.esm.min.js"
import { contractAddress, abi } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const withdrawButton = document.getElementById("withdrawButton")
const balanceButton = document.getElementById("balanceButton")

connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw
balanceButton.onclick = getBalance


async function connect() {
    if (typeof window.ethereum !== "undefined") {
     await window.ethereum.request({method: "eth_requestAccounts"})
     connectButton.innerHTML = "Connected"
    } else {
     connectButton.innerHTML = "Please Install MetaMask...!"
    }
 }

 async function getBalance() {
   if(typeof window.ethereum !== "undefined") {

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)

      console.log(`Funded Amount: ${ethers.utils.formatEther(balance)}`)
   }
 }

 async function fund() {
    const ethAmount = document.getElementById("ethAmount").value

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        console.log(`Funding.....`)

      try {
         const response = await contract.fund({value: ethers.utils.parseEther(ethAmount)})

         await listenForTransactionMine(response, provider)
         console.log("Done...!")

      }catch(error) {

         console.log(error)
      }
    }
 }
 
 function listenForTransactionMine(response, provider) {
   console.log(`Mining the block ${response.hash}....`)

 return new Promise((resolve, reject) => {

      try{
         provider.once(response.hash, (responseReciept) => {
            console.log(`Waiting for ${response.confirmations} Confirmations...`)
      
            resolve()
         })
      }catch(error){

         reject(error)
      }
   })
 }

 async function withdraw() {
   if(typeof window.ethereum !== "undefined") {

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer  = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      console.log("Withdrawing.....")

   try{
      const response = await contract.withdraw()

      await listenForTransactionMine(response, provider)
      console.log("Done...!")

   } catch(error) {

      console.log(error)
   }
  }   
 }