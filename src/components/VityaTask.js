import { Button, Flex } from "antd";

const VityaTask = (props) => {
  let displayNum = 50;

  const buttonUp = () => {
    const [buttonUpEditState, setButtonUpEditState] = useState(true);
  };

  return (
    <Button
      onClick={() => {
        console.log("меня нажали", scheduleElements);
        setButtonEditState(false);
        if (buttonEditState === false) {
          setButtonEditState(true);
        }
      }}
    >
      Увеличить число
    </Button>
  );
};
