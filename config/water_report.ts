import { database } from "@/config/firebaseConfig";
import { ref, set } from "@firebase/database";
// @ts-ignore
import { WaterReportEntry } from "@/types";

function insertUpateWaterReportData(waterReport: WaterReportEntry) {
  set(ref(database, "water_report/" + waterReport.id), {
    title: waterReport.title,
    description: waterReport.description,
    town: waterReport.town,
    district: waterReport.district,
    images: waterReport.images,
  })
    .then(() => {
      console.log("water report post added successfully.");
    })
    .catch((error) => {
      console.error("water report post failed: ", error);
    });
}

function deleteWaterReportData(waterReportID: string) {
  set(ref(database, "water_report/" + waterReportID), null)
    .then(() => {
      console.log("water report post deleted successfully.");
    })
    .catch((error) => {
      console.error("water report post deletion failed: ", error);
    });
}

export { insertUpateWaterReportData, deleteWaterReportData };
