import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

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

            setExcelData(data);
            console.log(data);
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
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
//
// function Data() {
//   const [excelData, setExcelData] = useState([]);
//
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//
//     reader.onload = (event) => {
//       const binaryString = event.target.result;
//       const workbook = XLSX.read(binaryString, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//
//       setExcelData(data);
//             console.log(data);
//     };
//
//     reader.readAsBinaryString(file);
//   };
//
//   return (
//     <div>
//       <input type="file" onChange={handleFileUpload} />
//       <table>
//         <tbody>
//           {excelData.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((cell, cellIndex) => (
//                 <td key={cellIndex}>{cell}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
//
// export default Data;
