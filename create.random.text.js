// ! This is not the part of our project

import { log } from "console";
import crypto from "crypto";
const getRandomText = () => {
  const randomText = crypto.randomBytes(64).toString("hex");
  console.log(randomText);
};

getRandomText();
