import { Center, Heading } from "@hope-ui/solid"
import { useManageTitle } from "~/hooks"

const Dashboard = () => {
  useManageTitle("manage.sidemenu.dashboard")
  return (
    <Center h="$full">
      <Heading>Welcome</Heading>
    </Center>
  )
}

export default Dashboard
