import React, { useState } from 'react';
import * as XLSX from "xlsx";

export default function ImportFile() {
    const [excelData, setExcelData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryString = event.target.result;
            const workbook = XLSX.read(binaryString, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const tab = data.filter((el) => el.length !== 0)
                .map((el) => [el[0], el[1], el[17], el[15]])
                .slice(1)
                .map((el) => [{
                    nom: el[0],
                    prenom: el[1],
                    adresse: el[2],
                    codePostal: el[3]
                }][0]);
            console.log(tab);

            setExcelData(data.filter((el) => el.length !== 0).map((el) => [el[0], el[1], el[17], el[15]]));
            // console.log(data.filter((el) => el.length !== 0).map((el) => [el[0], el[1], el[17], el[15]]));
        };

        reader.readAsBinaryString(file);
    };
    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            <table>
                <tbody>
                    {excelData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}
