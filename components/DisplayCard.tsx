import { Card, Text, Group, JsonInput } from '@mantine/core';
// import { IconArrowBarToDown } from "@tabler/icons-react"

type DisplayCardProps = {
    json_string: string;
    isLoading: boolean
}

function DisplayCard({ json_string, isLoading }: DisplayCardProps){

    return (
        <>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
        
            <Text w={500} fw={300}>
                Result
            </Text>
   
            <JsonInput
                disabled={isLoading}
                mt={8}
                // label="Your package.json"
                placeholder="Textarea will autosize to fit the content"
                validationError="Invalid JSON"
                formatOnBlur
                autosize
                value={json_string}
                minRows={4}
            />


        </Card>
        </>
    )
}
    
export default DisplayCard
