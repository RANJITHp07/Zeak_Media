import Leftbar from "../leftbar"
import {render,cleanup,afterEach} from "@testing-library/react"

afterEach(cleanup)

describe(Leftbar,()=>{
    it('check if there is heading',()=>{
        const {getByTestId}=render(<Leftbar/>)
        const test=getByTestId('test').textContent
     
        expect(test).toEqual('Close Friends');
    })
  
})