import React from 'react'
import { Alert,Divider } from 'antd'

export default function Home() {
  return (
   <>
      <Alert
        message="This is the home page"
        description="But I am not sure  what to render here. Sorry for the inconvinience cost"
        type="info"
        showIcon
      />
      <Divider/>
      <Alert
        message="May be"
        description="You can try select one option from the menu of the leftside."
        type="info"
        showIcon
      />
      <Divider/>
      <Alert
        message="Oh BTW"
        description="You see there are 4 productlist there, but actually only the first Product List use all the Spiritx API. The rest of them only use the GET api. I do this because at the begining I am not sure if I am gonna use Antd table or write by my own, so I did both version. Finally I decide to go for Antd but I'd keep my own version here.
        I have left the notes in those components of the difference of those components, you can check for details"
        type="info"
        showIcon
      />
   </>
  )
}
