import "dotenv/config";
import moment from "moment";
import App from "./app";
import { ObservedObjectController } from "./controller/observed-object-controller";
import { FieldbookController } from "./controller/fieldbook-controller";

const app = new App([
  new ObservedObjectController(),
  new FieldbookController(),
]);

moment.locale("de");
app.listen();
