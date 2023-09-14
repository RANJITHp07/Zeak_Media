import Form from "../form"
import {render,fireEvent,screen,cleanup,afterEach} from "@testing-library/react"
import {store} from "../../redux/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router} from 'react-router-dom';

afterEach(cleanup)


describe(Form,()=>{
  const{getByTestId}=render(<Provider store={store}><Router><Form page={false} /></Router></Provider>);
    const forgetPasswordText = screen.getByText('Forget Password');
  fireEvent.click(forgetPasswordText);

 
  const modal=getByTestId('otp')
  expect(modal).toBeInTheDocument();
})