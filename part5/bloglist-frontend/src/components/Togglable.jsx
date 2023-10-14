import { forwardRef, useImperativeHandle, useState } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisible = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisible,
    }
  })
  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisible}>{props.buttonLabelShow}</button>
      </div>
      <div style={showWhenVisible}>
        {props.type == 'after' ? (
          <>
            {props.children}
            <button onClick={toggleVisible}>{props.buttonLabelHide}</button>
          </>
        ) : (
          <>
            <button onClick={toggleVisible}>{props.buttonLabelHide}</button>
            {props.children}
          </>
        )}
      </div>
    </>
  )
})

export default Togglable
