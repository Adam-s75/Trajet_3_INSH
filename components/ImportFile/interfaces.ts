export interface StudentTimes {
    name: string,
    surname: string,
    address: string,
    postalCode: number,
    timeTransit: number,
    timeDriving: number,
    timeCycling: number,
}

export interface Student {
    name: string,
    surname: string,
    address: string,
    postalCode: number,
}

export interface Times {
    timeTransit: number,
    timeDriving: number,
    timeCycling: number,
}
