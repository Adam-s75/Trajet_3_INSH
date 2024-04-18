import React, { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import styles from "./ImportFile.module.css"

import { Student, Times, StudentTimes } from './interfaces';
import SearchBar from '../SearchBar/SearchBar';

type FileEvent = React.ChangeEvent<HTMLInputElement>

export default function ImportFile() {
    const [excelData, setExcelData] = useState<Array<Array<string | number>>>([]);
    const [jsonData, setJsonData] = useState<Array<Student>>()
    const [students, setStudents] = useState<Array<StudentTimes>>([])
    const [companyAddress, setCompnayAddress] = useState<string>('');
    const [companyPostalCode, setCompanyPostalCode] = useState<string>('');
    const [companyFullAddress, setCompanyFullAddress] = useState<string>('6b rue de Viroflay, 75015');
    const apiUrl: string = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    function handleFileUpload(e: FileEvent): void {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryString = event.target.result;
            const workbook = XLSX.read(binaryString, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const tab: (string | number)[][] = data.filter((el: (string | number)[]) => el.length !== 0);

            function findIndexOfName(array: (string | number)[], name: string): number {
                return array.findIndex((e: (string | number)) => String(e).toLowerCase() === name);
            };

            const indexNom: number = findIndexOfName(tab[0], 'nom');
            const indexPrenom: number = findIndexOfName(tab[0], 'prÃ©nom');
            const indexAdresse: number = findIndexOfName(tab[0], 'adresse');
            const indexCodePostal: number = findIndexOfName(tab[0], 'code postal');


            const tabFiltered: Student[] = tab.map((el: (string | number)[]) => {
                return {
                    surname: String(el[indexNom]),
                    name: String(el[indexPrenom]),
                    address: String(el[indexAdresse]),
                    postalCode: Number(el[indexCodePostal])
                }
            }).slice(1);

            setJsonData(tabFiltered)

            setExcelData(tab.map((el: (string | number)[]) => [
                el[indexNom],
                el[indexPrenom],
                el[indexAdresse],
                el[indexCodePostal]
            ]));
        };

        if (!file) {
            return;
        }
        reader.readAsBinaryString(file);
    };
    useEffect(() => {
        async function test(
            studentFullAddress: string,
            companyFullAddress: string,
            modeOfTransportation: string) {

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": "AIzaSyAP0vPTrnodvVpP2RdAqT8uu24CS2I_AVc",
                    'X-Goog-FieldMask': 'routes.duration'
                },
                body: JSON.stringify({
                    origin: {
                        address: studentFullAddress
                    },
                    destination: {
                        address: companyFullAddress
                    },
                    travelMode: modeOfTransportation,
                    languageCode: "en-US",
                    units: "METRIC"
                })
            })
            const data = await response.json();
            const returnData = Number(data.routes[0].duration.slice(0, -1));
            return returnData;
        }

        async function validAddress(address: string): Promise<void> {
            if (!address) {
                return;
            }
            const response = await fetch("https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyAP0vPTrnodvVpP2RdAqT8uu24CS2I_AVc", {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    address: {
                        addressLines: address,
                        regionCode: "FR"
                    }
                })

            })
            const data = await response.json();
            if (jsonData && data && data.result.verdict.hasUnconfirmedComponents !== true) {

                const studentTimes: StudentTimes[] = jsonData.map((el: Student): StudentTimes => {
                    const transitTime: Promise<number> = test(`${el.address}, ${el.postalCode}`, companyFullAddress, "TRANSIT");
                    const drivingTime: Promise<number> = test(`${el.address}, ${el.postalCode}`, companyFullAddress, "DRIVE");
                    const cyclingTime: Promise<number> = test(`${el.address}, ${el.postalCode}`, companyFullAddress, "BICYCLE");
                    return {
                        name: el.name,
                        surname: el.surname,
                        address: el.address,
                        postalCode: el.postalCode,
                        timeTransit: transitTime,
                        timeDriving: drivingTime,
                        timeCycling: cyclingTime,
                    }
                })
                setStudents(studentTimes)

            }
        }
        validAddress(companyFullAddress);
    }, [jsonData, companyFullAddress])

    function handleSubmit() {
        setCompanyFullAddress(`${companyAddress}, ${companyPostalCode}`);
    }

    return (
        <div>
            <input className={styles.import} type="file" onChange={handleFileUpload} />
            <SearchBar/>
            <button onClick={handleSubmit}>Rechercher</button>
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
