import {database} from "@/config/firebaseConfig";
import {get, ref, set} from "@firebase/database";
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

async function getWaterSourceData() {
    const snapshot = await get(ref(database, "water_source"));
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
    } else {
        console.log("No data available");
        return [];
    }
}

export {insertUpdateWaterSourceData, deleteWaterSourceData};