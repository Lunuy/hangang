import { load } from "cheerio";
import got from "got";

const seoulTimezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

function toInverseOffsettedDate(date : Date) {
    return new Date(date.valueOf() - seoulTimezoneOffset);
}

// Convert to Korea time string
function toStringDate(date : Date) {
    return toInverseOffsettedDate(date).toISOString().substr(0, 10);
}
function toStringHours(date : Date) {
    return toInverseOffsettedDate(date).toISOString().substr(11, 2);
}

function requestDataPage(date : Date) {
    const stringDate_from = toStringDate(new Date(date.valueOf() - 1000*60*60*24));
    const stringDate_to = toStringDate(date);

    return got("http://www.koreawqi.go.kr/wQDDRealTotalDataList_D.wq", {
        encoding: "ascii",
        method: "GET",
        searchParams: {
            item_id: "M69",
            action_type: "L",
            action_type_seq: "1",
            search_data_type: "1",
            site_id: "'S01004'",
            site_name: "",
            search_interval: "HOUR",
            search_date_from: stringDate_from,
            search_date_to: stringDate_to,
            order_type_1: "MSR_DATE",
            order_type_2: "DESC"
        }
    });
}

function getTempFromHtmlResult(htmlResult : string, date : Date) {
    const stringDate = toStringDate(date);
    const stringHours = toStringHours(date);
    const $ = load(htmlResult);

    const index = $(`.table_04>tbody>tr>td[title*="[${stringDate} ${stringHours}h]"]:last-child`).parent().index();
    return parseFloat(
        $(`.table_04>tbody>tr:nth-child(n+${index+1})>td:last-child`)
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        [0]
    );
}

async function getTemp(date : Date = new Date()) {
    return getTempFromHtmlResult((await requestDataPage(date)).body, date);
}

export default getTemp;