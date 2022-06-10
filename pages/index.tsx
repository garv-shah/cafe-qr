import type { NextPage } from 'next'
import {useState, useRef, useEffect, ChangeEvent} from "react";
import {TextInput, Button, Group, Box, List, Center, Title, Text, Space, Select} from '@mantine/core';
import {useForm} from '@mantine/form';
import QRCodeStyling from '@solana/qr-code-styling';

const emojiUnicode = require("emoji-unicode");
const emojiRegex = require('emoji-regex');

const qrCode = new QRCodeStyling({
    width: 400,
    height: 400,
    dotsOptions: {
        color: "#040720",
        type: "square"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
});

const Home: NextPage = () => {
    const form = useForm({
        initialValues: {
            ingredient: '',
        },
    });

    const [ingredients, setIngredients] = useState<string[]>([]);

    // Events
    function addIngredient(food: { ingredient: string }) {
        if (food.ingredient != '') {
            const next = [...ingredients, food.ingredient];
            setIngredients(next);
            form.reset();
            setUrl(String(next));
        }
    }

    const [url, setUrl] = useState("");
    const [fileExt, setFileExt] = useState("png");
    const [emoji, setEmoji] = useState("😍");
    let emojiCode = emojiUnicode(emoji);
    let emojiUrl = `https://twemoji.maxcdn.com/v/latest/svg/${emojiCode.replace(/ /gi, "-")}.svg`;

    function emojiUpdate(event: ChangeEvent<HTMLInputElement>) {
        const regex = emojiRegex();
        const text = event.currentTarget.value;
        let internalEmoji = ''

        // @ts-ignore
        for (const match of text.matchAll(regex)) {
            internalEmoji = match[0];
            emojiCode = emojiUnicode(internalEmoji);
            emojiUrl = `https://twemoji.maxcdn.com/v/latest/svg/${emojiCode.replace(/ /gi, "-")}.svg`;
        }

        setEmoji(internalEmoji);
        qrCode.update({
            image: (internalEmoji == '') ? '' : emojiUrl
        });
        console.log(emojiUrl)
    }

    const ref = useRef(null);

    useEffect(() => {
        qrCode.update({
            image: emojiUrl
        });

        // @ts-ignore
        return qrCode.append(ref.current);
    }, []);

    useEffect(() => {
        qrCode.update({
            data: url
        });
    }, [url]);

    const onDownloadClick = () => {
        qrCode.download({
            // @ts-ignore
            extension: fileExt
        });
    };

    return (
      <>
          <Space h="md"/>

          <Center>
              <Title>
                  <Text inherit variant="gradient" component="span">Café QR</Text>
              </Title>
          </Center>

          <Space h="md"/>

          <Box sx={{maxWidth: 300}} mx="auto">
              <form onSubmit={form.onSubmit((values) => addIngredient(values))}>
                  <TextInput
                      label="Ingredient"
                      {...form.getInputProps('ingredient')} />

                  <TextInput
                      label="Emoji"
                      onChange={emojiUpdate}
                      value={emoji}
                  />

                  <Space h="lg"/>

                  <Select value={fileExt} onChange={(event) => setFileExt(event ?? 'svg')} data={[
                      { value: 'png', label: 'PNG' },
                      { value: 'webp', label: 'WEBP' },
                      { value: 'jpeg', label: 'JPEG' },
                      { value: 'svg', label: 'SVG' },
                  ]}></Select>

                  <Group position="center" mt="md">
                      <Button type="submit">Add</Button>
                      <Button onClick={onDownloadClick}>Download</Button>
                  </Group>
              </form>
          </Box>

          <Space h="lg"/>

          <Center>
              <List>
                  {ingredients.map(ingredient => (<List.Item key={ingredient}>{ingredient}</List.Item>))}
              </List>
          </Center>

          <Space h="lg"/>

          <Center>
              <div ref={ref} />
          </Center>
      </>
  );
}

export default Home
