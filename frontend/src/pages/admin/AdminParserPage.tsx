import { Button, Table } from "@chakra-ui/react";

export default function AdminParserPage() {
    return (
        <>
        Вітаємо на вкладці "Управілння парсером оголошень"
        Тут ви зможете керувати інформацією про контейнери з парсера у формі таблиць та додавати нові оголошення
        <Button size="xl" color="#FD7F16" bgColor="white" borderColor="#FD7F16">Додати оголошення</Button>
        
        <Table.Root>
            
        </Table.Root>
        </>
    )
}