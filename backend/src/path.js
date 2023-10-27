import {fileURLToPath} from "url";
import { dirname } from "path";

export const __filename = fileURLToPath(import.meta.url);//retorna nombre del archivo
export const __dirname = dirname(__filename); //retorna ruta del archivo;