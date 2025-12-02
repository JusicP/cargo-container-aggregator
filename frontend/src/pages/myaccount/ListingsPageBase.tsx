import { Box, Tabs, Container } from "@chakra-ui/react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

interface Item {
  value: string;
  title: string;
}

const items: Item[] = [
  { title: "Активні", value: "active" },
  { title: "Очікуючі", value: "pending" },
  { title: "Відхилені", value: "rejected" },
  { title: "Видалені", value: "deleted" },
]

export default function ListingsBasePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = items.find((item) => location.pathname.includes(item.value))?.value || items[0].value;

  return (
    <Box w="100%" py={10}>
      <Container maxW={{ base: "95%", lg: "75%" }}>
        
        <Tabs.Root
          value={currentTab}
          variant="line"
          size="md"
          onValueChange={(e) => navigate(e.value)}
        >
          <Tabs.List w="fit" justifySelf="center"> 
            {items.map((item) => (
              <Tabs.Trigger value={item.value} key={item.value}>
                {item.title}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Box mt={6} bg="white" minH="200px">
            <Outlet />
          </Box>
        </Tabs.Root>
      </Container>
    </Box>
  )
}