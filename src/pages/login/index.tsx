import { AUTO_LOGIN_KEY } from '@/enum';
import { postUserLoginByUserPwd } from '@/services/api/user';
import { removeToken } from '@/utils';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { history } from '@umijs/max'; // 添加这行引入
import { Form } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';

interface LoginFormValues {
  username: string;
  password: string;
  autoLogin?: boolean;
}

export default () => {
  const [formRef] = Form.useForm();
  useEffect(() => {
    const values = localStorage.getItem(AUTO_LOGIN_KEY);
    const { username, password, autoLogin } = JSON.parse(values || '{}');
    if (autoLogin) {
      formRef.setFieldsValue({
        username,
        password,
        autoLogin,
      });

      formRef.submit(); // 这会触发表单的 onFinish
    } else {
      removeToken();
    }
  }, []);

  const onFinish = async (values: LoginFormValues) => {
    await postUserLoginByUserPwd({
      username: values.username,
      password: values.password,
    });

    if (values.autoLogin) {
      localStorage.setItem(AUTO_LOGIN_KEY, JSON.stringify(values));
    } else {
      localStorage.removeItem(AUTO_LOGIN_KEY);
    }
    history.push('/');
  };

  return (
    <div className={styles['login-wrapper']}>
      <div className={styles['login-container']}>
        <LoginForm
          form={formRef}
          className={styles['login-form']}
          title="欢迎回来"
          subTitle="登录您的账号以继续访问"
          containerStyle={{
            height: 'auto',
            width: 'auto',
            paddingBlock: 32,
          }}
          onFinish={onFinish}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'用户名: admin'}
            // width={400}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'密码: 123456'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};
