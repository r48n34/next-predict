import * as tf from '@tensorflow/tfjs';
import { Button, Group, Box, FileInput, Text, Grid, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { IconUpload, IconFileUpload } from '@tabler/icons-react';

import toast from 'react-hot-toast';
import DisplayCard from './DisplayCard';
import { createModel, predictResultTopFive } from '@/utilis/predictUtili';
import { modelData } from '@/useData/modelData';

interface FormObject {
    file: File | null
}

function UploadFormComp() {

    const [ myModel, setMyModel ] = useState<tf.GraphModel<string | tf.io.IOHandler> | null>(null); // model container
    const [ loadingProgress, setLoadingProgress ] = useState<number>(0);

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
                : value.size / 1024 / 1024 >= 12 // in MiB 
                ? 'png file too big'
                : null
            ),
        },
    });

    useEffect(() => {
        ( async () => {

            let mod = await createModel("/models/model.json", "GraphModel", setLoadingProgress);
            setMyModel(mod as tf.GraphModel<string | tf.io.IOHandler>);

        })()
    }, []);

    async function uploadform(values: FormObject) {

        try {
            setIsLoading(true);

            let res = await predictResultTopFive(
                myModel as tf.GraphModel<string | tf.io.IOHandler>,
                "img",
                modelData.offlineInfo.size,
                modelData.offlineInfo.subVal,
                modelData.offlineInfo.divValue,
                modelData.labels
            );

            console.log(res)
            setReturnData(JSON.stringify(res, null, 4))

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

        { myModel === null &&
            <Group justify='center'>
                <Loader color="blue" />
            </Group>
        }

        <Grid gutter="xl" mt={12}>
            <Grid.Col span={{ md: 7 }}>
                <Box mx="auto" mt={32}>

                <form onSubmit={form.onSubmit((values) => uploadform(values))}>

                    <FileInput
                        disabled={isLoading}
                        placeholder="hello.png"
                        label="Png file"
                        withAsterisk
                        accept="image/png, image/jpg, image/jpeg"
                        leftSection={<IconUpload size={12} />}
                        {...form.getInputProps('file')}
                    />
                     <Text c="dimmed" fz="xs" mt={4}>Should not be bigger than 6MB</Text>

                    { form.values.file 
                    ? 
                    <Box>
                        <Text w={600}>Preview</Text>
                        <img 
                            id="img" 
                            src={URL.createObjectURL(form.values.file)} 
                            style={{ width:"50%", height:"auto" }} 
                            alt="pics"
                        />
                    </Box>
                    : <></>
                    }

                    <Group justify="flex-end" mb={16} mt={22}>
                        <Button leftSection={<IconFileUpload />} variant="light" type="submit" loading={isLoading || myModel === null}>
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