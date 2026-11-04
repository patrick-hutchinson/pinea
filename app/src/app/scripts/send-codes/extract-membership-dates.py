"""Read the client workbook into JSON; never change the workbook or infer missing dates."""
import datetime
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def extract(filename):
    with zipfile.ZipFile(filename) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        properties = workbook.find("m:workbookPr", NS)
        if properties is not None and properties.get("date1904") in ("1", "true"):
            raise ValueError("1904 date-system workbooks need explicit review")
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = ["".join(node.itertext()) for node in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("m:si", NS)]
        rows = ET.fromstring(archive.read("xl/worksheets/sheet1.xml")).findall("m:sheetData/m:row", NS)
        values = []
        for row in rows:
            cells = {}
            for cell in row.findall("m:c", NS):
                column = re.sub(r"\d", "", cell.get("r", ""))
                raw = cell.find("m:v", NS)
                inline = cell.find("m:is", NS)
                value = raw.text if raw is not None else "".join(inline.itertext()) if inline is not None else ""
                cells[column] = strings[int(value)] if cell.get("t") == "s" else value or ""
            values.append((int(row.get("r")), cells))
        headers = values[0][1]
        if headers.get("M") != "Email" or headers.get("P") != "Datum" or headers.get("L") != "ab Ausgabe":
            raise ValueError("Unexpected workbook columns; review before matching")
        result = []
        for row_number, cells in values[1:]:
            if not any(cells.get(key) for key in ("B", "E", "F", "M", "P")):
                continue
            raw_date = cells.get("P", "").strip()
            date = ""
            if raw_date:
                if not re.fullmatch(r"\d+(?:\.0+)?", raw_date):
                    raise ValueError(f"Unrecognized date at P{row_number}")
                date = (datetime.date(1899, 12, 30) + datetime.timedelta(days=int(float(raw_date)))).isoformat()
            result.append({
                "source_row": str(row_number), "email": cells.get("M", "").strip(),
                "name": " ".join(cells.get(key, "").strip() for key in ("E", "F")).strip(),
                "source_membership": cells.get("B", "").strip(), "source_region": cells.get("C", "").strip(),
                "membership_start_date": date,
                "is_free_membership": "true" if re.search(r"\bFREE\b", cells.get("B", ""), re.I) else "false",
            })
        return result


if __name__ == "__main__":
    json.dump(extract(sys.argv[1]), sys.stdout, ensure_ascii=False)
