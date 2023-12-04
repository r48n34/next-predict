import { Button, Group, Box, FileInput, Text, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { IconUpload, IconFileUpload } from '@tabler/icons-react';

import toast from 'react-hot-toast';
import DisplayCard from './DisplayCard';

interface FormObject {
    file: File | null
}

function UploadFormComp() {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ returnData, setReturnData ] = useState<string>("");

    const form = useForm<FormObject>({
        initialValues: {
            file: null,
        },
        validate: {
            file: (value) => (
                !value 
                ? 'Missing png file'
                : value.size / 1024 / 1024 >= 6 // in MiB 
                ? 'png file too big'
                : null
            ),
        },
    });

    async function uploadform(values: FormObject) {

        try {
            setIsLoading(true);
    
            const formData = new FormData();
            formData.append("file", values.file as any)

            const res = await fetch("/api/predictStuff", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if(res.status === 200){
                setReturnData(JSON.stringify(data, null, 4))  
                toast.success("Enjoy your files!");
            }
            else {
                toast.error(data.error, { position: 'top-right' })
            }

        } 
        catch (error) {
            toast.error("Error. Please try another file", { position: 'top-right' })
        }
        finally{
            setIsLoading(false)
        }
        
    }

    return (
        <>
        <Text ta={"center"} fz={34} fw={300} mb={32} mt={4}> Predict stuff </Text>
        <Text ta={"center"} fz={14} fw={300} mt={-34} c='dimmed'> Predict stuff in nextjs runtime </Text>

        <Grid gutter="xl" mt={12}>
            <Grid.Col span={{ md: 7 }}>
                <Box mx="auto" mt={32}>

                <form onSubmit={form.onSubmit((values) => uploadform(values))}>

                    <FileInput
                        disabled={isLoading}
                        placeholder="hello.png"
                        label="Png file"
                        withAsterisk
                        accept="image/png"
                        leftSection={<IconUpload size={12} />}
                        {...form.getInputProps('file')}
                    />
                    <Text c="dimmed" fz="xs" mt={4}>Should not be bigger than 6MB</Text>

                    <Group justify="flex-end" mb={16} mt={22}>
                        <Button leftSection={<IconFileUpload />} variant="light" type="submit" loading={isLoading}>
                            { isLoading ? "Processing" : "Upload" }
                        </Button>
                    </Group>
                    
                </form>
                </Box>
            </Grid.Col>

            <Grid.Col span={{ md: 5 }}>
                <DisplayCard json_string={returnData || ""} isLoading={isLoading}/>
            </Grid.Col>

        </Grid>
        </>
    );
}

export default UploadFormComp