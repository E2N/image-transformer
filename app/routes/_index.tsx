import { LoaderArgs, json } from "@remix-run/node";

// export const loader = async ({ request }: LoaderArgs) => {};

export default function Index() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      Transform your images
    </div>
  );
}
