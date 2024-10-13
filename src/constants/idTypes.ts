export enum IdType {
  Ci = "IDENTIFICACION",
  ContractNumber = "CUENTA_CONTRATO",
  UniqueCode = "CUEN",
}

export const idTypes = [
  {
    label: "Cédula de identidad",
    value: IdType.Ci,
  },
  {
    label: "Número de contrato",
    value: IdType.ContractNumber,
  },
  {
    label: "Código único",
    value: IdType.UniqueCode,
  },
];
