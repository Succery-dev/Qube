import { AutotaskClient } from "@openzeppelin/defender-autotask-client";
import * as dotenv from "dotenv";
dotenv.config();

async function uploadCode(autotaskId: string, apiKey: string, apiSecret: string) {
  const client = new AutotaskClient({ apiKey, apiSecret });
  await client.updateCodeFromFolder(autotaskId, "./build");
}

async function main() {
  const autotaskId = `${process.env.AUTOTASK_ID}`;
  const apiKey = `${process.env.TEAM_API_KEY}`;
  const apiSecret = `${process.env.TEAM_API_SECRET}`;
  if (!autotaskId) throw new Error("Missing autotask id");
  await uploadCode(autotaskId, apiKey, apiSecret);
  console.log("Autotask Code updated");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });