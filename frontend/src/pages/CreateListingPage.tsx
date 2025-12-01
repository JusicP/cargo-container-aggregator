import ListingCreateForm from "@/components/ui/listing/ListingCreateForm";
import {Text, Box} from "@chakra-ui/react";

export default function CreateListingPage() {
    return (
        <Box className="bg-white flex flex-col items-center justify-center" m={10}>
            <div className="flex flex-col items-center !mb-5">
                <div className="flex flex-col items-center leading-tight">
                    <Text
                        fontSize="27px"
                        fontWeight="semibold"
                        color="#52525B"
                        fontFamily="heading"
                        letterSpacing="tight"
                    >
                        Створення оголошення
                    </Text>
                </div>
            </div>
            <ListingCreateForm />
        </Box>
    );
}
