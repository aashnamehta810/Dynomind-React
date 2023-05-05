import { Company } from '@app/interfaces/interfaces';
import * as S from '../StepForm.styles';

interface Field {
  name?: string;
  value: string;
}

interface Step4Props {
  formValues: Field[];
  companyList: Company[];
}

export const Step4: React.FC<Step4Props> = ({ formValues, companyList }) => {
  // to get the selected compnay from forminputs
  const selectedCompany = formValues.find((item) => {
    return item.name === 'Company';
  });
  // to get the selected company from the compaylist
  const searchSelectedCompany = companyList.find((item) => {
    return item.id === selectedCompany?.value;
  });

  return (
    <S.Details key="4">
      {formValues
        .filter((item) => !!item.value && item.name !== 'Confirm Password')
        .map((item: Field, index: number) => {
          return (
            <S.DetailsRow key={`${index}-${item.name}`}>
              <S.DetailsTitle>{item.name}</S.DetailsTitle>
              {item.name === 'Password' ? (
                <S.DetailsValue>{'********'}</S.DetailsValue>
              ) : (
                <S.DetailsValue>{item.name === 'Company' ? searchSelectedCompany?.name : item.value}</S.DetailsValue>
              )}
            </S.DetailsRow>
          );
        })}
    </S.Details>
  );
};
