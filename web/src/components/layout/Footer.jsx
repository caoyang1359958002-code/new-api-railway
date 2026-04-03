/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@douyinfe/semi-ui';
import { getFooterHTML, getLogo, getSystemName } from '../../helpers';
import { useTranslation } from 'react-i18next';

const FooterBar = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState(getFooterHTML());
  const systemName = getSystemName();
  const logo = getLogo();
  const currentYear = new Date().getFullYear();

  const loadFooter = () => {
    const footerHTML = localStorage.getItem('footer_html');
    if (footerHTML) {
      setFooter(footerHTML);
    }
  };

  const customFooter = useMemo(
    () => (
      <footer className='landing-footer'>
        <div className='landing-footer-grid'>
          <div className='landing-footer-brand'>
            <img src={logo} alt={systemName} className='landing-footer-logo' />
            <div>
              <h3>{systemName}</h3>
              <p>
                {t(
                  '统一承接多模型入口，让接入、聚合与售卖 API 的展示面更直接，也更像一套可运营的服务。',
                )}
              </p>
            </div>
          </div>

          <div className='landing-footer-links'>
            <div>
              <span className='landing-footer-heading'>{t('站点导航')}</span>
              <Link to='/'>{t('首页')}</Link>
              <Link to='/console'>{t('控制台')}</Link>
              <Link to='/pricing'>{t('模型广场')}</Link>
            </div>

            <div>
              <span className='landing-footer-heading'>{t('快速入口')}</span>
              <Link to='/login'>{t('登录')}</Link>
              <Link to='/register'>{t('注册')}</Link>
              <Link to='/user-agreement'>{t('用户协议')}</Link>
            </div>

            <div>
              <span className='landing-footer-heading'>{t('项目说明')}</span>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub
              </a>
              <Link to='/privacy-policy'>{t('隐私政策')}</Link>
              <span className='landing-footer-muted'>
                {t('企业级 AI 接入展示页')}
              </span>
            </div>
          </div>
        </div>

        <div className='landing-footer-bottom'>
          <Typography.Text className='landing-footer-copy'>
            © {currentYear} {systemName}. {t('版权所有')}
          </Typography.Text>
          <Typography.Text className='landing-footer-copy'>
            {t('基于 New API 构建并完成前端定制')}
          </Typography.Text>
        </div>
      </footer>
    ),
    [currentYear, logo, systemName, t],
  );

  useEffect(() => {
    loadFooter();
  }, []);

  return (
    <div className='w-full'>
      {footer ? (
        <footer className='relative h-auto py-4 px-6 md:px-24 w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-[1110px] gap-4'>
            <div
              className='custom-footer na-cb6feafeb3990c78 text-sm !text-semi-color-text-1'
              dangerouslySetInnerHTML={{ __html: footer }}
            />
            <div className='text-sm flex-shrink-0'>
              <span className='!text-semi-color-text-1'>
                {t('设计与开发由')}{' '}
              </span>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='!text-semi-color-primary font-medium'
              >
                New API
              </a>
            </div>
          </div>
        </footer>
      ) : (
        customFooter
      )}
    </div>
  );
};

export default FooterBar;
