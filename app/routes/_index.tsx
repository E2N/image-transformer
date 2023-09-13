import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { exec } from "node:child_process";
import { Button, TextField } from "~/components";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const scale = formData.get("scale");
  exec(`magick ${file} -resize ${scale} resized.jpg`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`stdout: ${stdout}`);
    }
  });
  return null;
};

export default function Index() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Form action="/?index" method="post" className="flex flex-col gap-2">
        <TextField
          onChange={(e) => console.log(e.target.files)}
          label="Datei"
          name="file"
          type="file"
        />
        <TextField label="Skalierung" name="scale" />
        <Button type="submit">Skalieren</Button>
      </Form>
    </div>
  );
}
