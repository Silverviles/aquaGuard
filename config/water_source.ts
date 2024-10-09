import {database} from "@/config/firebaseConfig";
import {ref, set} from "@firebase/database";
// @ts-ignore
import {WaterSourceLocationEntry} from "@/types";

function insertUpdateWaterSourceData(waterSource: WaterSourceLocationEntry) {
    set(ref(database, "water_source/" + waterSource.id), {
        title: waterSource.title,
        description: waterSource.description,
        latitude: waterSource.latitude,
        longitude: waterSource.longitude,
        latitudeDelta: waterSource.latitudeDelta,
        longitudeDelta: waterSource.longitudeDelta,
        images: waterSource.images,
    }).then(() => {
        console.log("Data write succeeded.");
    }).catch((error) => {
        console.error("Data write failed: ", error);
    });
}

function deleteWaterSourceData(waterSourceId: string) {
    set(ref(database, "water_source/" + waterSourceId), null).then(() => {
        console.log("Data deletion succeeded.");
    }).catch((error) => {
        console.error("Data deletion failed: ", error);
    });
}

export {insertUpdateWaterSourceData, deleteWaterSourceData};