import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from 'antd';
import { UserModel } from '@app/domain/UserModel';
import * as S from './ProfileInfo.styles';
import { capitalize, checkHTTPStatus } from 'utils/utils';
import { Image } from '@app/components/Error/Error.styles';
import editIcon from '@app/assets/icons/edit.svg';
import saveIcon from '@app/assets/icons/save.svg';
import closeIcon from '@app/assets/icons/close.svg';
import { Upload } from '@app/components/common/Upload/Upload';
import type { UploadProps } from 'antd';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doUploadProfilePicture, fetchUser } from '@app/store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { notificationController } from '@app/controllers/notificationController';
import { Entity } from '@app/constants/enums/entites';
import avatarImg from '@app/assets/images/avatar.webp';

interface ProfileInfoProps {
  profileData: UserModel | null;
}

interface Fileprops {
  uid?: string;
  lastModified?: number;
  lastModifiedDate?: unknown;
  name?: string;
  size?: number;
  type?: string;
  webkitRelativePath?: string;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [uploadImage, setUploadImage] = useState<string>('');
  const [profileImageFile, setProfileImageFile] = useState({});
  const [profileImageAction, setProfileImageAction] = useState(true);

  const props: UploadProps = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    method: 'POST',
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type === 'image/*';
      return isImage;
    },
    onChange: (info) => {
      fileReaderHandler(info.file);
      setProfileImageFile(info.file);
    },
  };

  const fileReaderHandler = (file: Fileprops) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      setUploadImage(event.target?.result as string);
    };
    reader.readAsDataURL(file as Blob);
  };

  const UserImageFunctionality = () => {
    if (uploadImage === '') {
      return profileData?.image && profileData?.image?.signedURL ? profileData?.image?.signedURL : avatarImg;
    } else {
      return uploadImage;
    }
  };

  useEffect(() => {
    uploadImage === '' ? setProfileImageAction(false) : setProfileImageAction(true);
  }, [uploadImage]);

  const closeProfileImageHandler = () => {
    setUploadImage('');
    setProfileImageAction(false);
    setProfileImageFile({});
  };

  const saveProfileImageHandler = () => {
    if (profileData) {
      dispatch(
        doUploadProfilePicture({
          file: profileImageFile,
          entityId: profileData.id,
          entity: Entity.USER,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(fetchUser());
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          checkHTTPStatus(Number(err.code), navigate);
        });
      setProfileImageAction(false);
    }
  };

  return profileData ? (
    <S.Wrapper>
      <S.ImgWrapper>
        <Avatar shape="circle" src={UserImageFunctionality()} alt="Profile" />
        <Upload className="editIcon" {...props}>
          <Image src={editIcon} alt="Edit" preview={false} />
        </Upload>
      </S.ImgWrapper>
      {profileImageAction && (
        <S.ActionWrapper>
          <Image src={closeIcon} alt="Close" preview={false} onClick={closeProfileImageHandler} />
          <Image src={saveIcon} alt="Save" preview={false} onClick={saveProfileImageHandler} />
        </S.ActionWrapper>
      )}
      <S.Title>{`${capitalize(profileData?.firstname)} ${capitalize(profileData?.lastname)}`}</S.Title>
      <S.Subtitle>{capitalize(profileData?.name || '')}</S.Subtitle>
      <S.Text>{t('profile.fullness')}</S.Text>
    </S.Wrapper>
  ) : null;
};
