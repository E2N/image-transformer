import { Form, useActionData } from "@remix-run/react";
import { exec } from "node:child_process";
import { Button, TextField } from "~/components";
import {
  type ActionArgs,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import image from "resized.jpg";

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("file") as any;
  const scale = formData.get("scale");

  if (file) {
    exec(
      `magick ${file.filepath} -resize ${scale} resized.jpg`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`stdout: ${stdout}`);
        }
      }
    );
  }

  return image;
};

async function downloadImage() {
  try {
    const image_src = await fetch("http://localhost:3000" + image);
    const imageBlob = await image_src.blob();
    const imageURL = URL.createObjectURL(imageBlob);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "resized.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  if (actionData) {
    downloadImage().then((r) => console.log("success"));
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Form
        encType="multipart/form-data"
        action="/?index"
        method="post"
        className="flex flex-col gap-2"
      >
        <TextField label="Datei" name="file" type="file" />
        <TextField label="Skalierung" name="scale" />
        <Button type="submit">Skalieren</Button>
      </Form>
    </div>
  );
}
