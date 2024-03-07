import CountTrueItems from "./CountTrueItems";


const ApiCall = () => {

    const test = () =>{
        alert("test")
        console.log("sadasd")
    }


    return (
    <>
    <div>
    
     <CountTrueItems test={test} /> 
    </div>
    
    </>


    );
}

export default ApiCall