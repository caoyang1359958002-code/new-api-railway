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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Typography } from '@douyinfe/semi-ui';
import {
  API,
  copy as copyText,
  getSystemName,
  showSuccess,
} from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  ArrowRight,
  Copy as CopyIcon,
  Gauge,
  Layers3,
  Radar,
  ShieldCheck,
  Sparkles,
  Waypoints,
  Workflow,
} from 'lucide-react';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Claude,
  Gemini,
  DeepSeek,
  Qwen,
  AzureAI,
} from '@lobehub/icons';

const { Text } = Typography;

const providerItems = [
  { label: 'OpenAI', icon: <OpenAI size={34} /> },
  { label: 'Claude', icon: <Claude.Color size={34} /> },
  { label: 'Gemini', icon: <Gemini.Color size={34} /> },
  { label: 'DeepSeek', icon: <DeepSeek.Color size={34} /> },
  { label: 'Qwen', icon: <Qwen.Color size={34} /> },
  { label: 'Moonshot', icon: <Moonshot size={34} /> },
  { label: 'xAI', icon: <XAI size={34} /> },
  { label: 'Zhipu', icon: <Zhipu.Color size={34} /> },
  { label: 'Volcengine', icon: <Volcengine.Color size={34} /> },
  { label: 'Azure', icon: <AzureAI.Color size={34} /> },
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isMobile = useIsMobile();

  const systemName = getSystemName();
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const version = statusState?.status?.version || 'v0.12.1';
  const activeEndpoints = API_ENDPOINTS.slice(0, 5);
  const activeEndpoint =
    activeEndpoints[endpointIndex % activeEndpoints.length];

  const shouldRenderCustomContent =
    homePageContentLoaded && homePageContent.trim() !== '';

  const featureItems = useMemo(
    () => [
      {
        icon: <Waypoints size={18} />,
        title: t('统一协议入口'),
        description: t('保持 OpenAI 兼容调用方式，渠道切换不需要改业务代码。'),
      },
      {
        icon: <ShieldCheck size={18} />,
        title: t('企业级稳定性'),
        description: t(
          '用缓存、限流和多模型路由兜住并发，减少上游抖动带来的损耗。',
        ),
      },
      {
        icon: <Gauge size={18} />,
        title: t('更适合售卖 API'),
        description: t(
          '适合继续叠加用户、套餐、计费和渠道运营，首页也更偏商业化展示。',
        ),
      },
    ],
    [t],
  );

  const capabilityRows = useMemo(
    () => [
      {
        icon: <Layers3 size={16} />,
        title: t('接入方式'),
        value: t('统一 Base URL'),
      },
      {
        icon: <Workflow size={16} />,
        title: t('兼容端点'),
        value: `${API_ENDPOINTS.length}+`,
      },
      {
        icon: <Radar size={16} />,
        title: t('推荐用途'),
        value: t('中转 / 售卖 / 多模型聚合'),
      },
      {
        icon: <Sparkles size={16} />,
        title: t('当前版本'),
        value: version,
      },
    ],
    [t, version],
  );

  const displayHomePageContent = async () => {
    const cached = localStorage.getItem('home_page_content') || '';
    setHomePageContent(cached);

    try {
      const res = await API.get('/api/home_page_content');
      const { success, data } = res.data;

      if (success) {
        const nextContent = data.startsWith('https://')
          ? data
          : marked.parse(data);
        setHomePageContent(nextContent);
        localStorage.setItem('home_page_content', nextContent);
      } else {
        setHomePageContent(cached);
      }
    } catch (error) {
      console.error('加载首页内容失败:', error);
      setHomePageContent(cached);
    } finally {
      setHomePageContentLoaded(true);
    }
  };

  const handleCopyBaseURL = async () => {
    const ok = await copyText(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % activeEndpoints.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [activeEndpoints.length]);

  useEffect(() => {
    if (!shouldRenderCustomContent || !homePageContent.startsWith('https://')) {
      return;
    }

    const iframe = document.querySelector('iframe');
    if (!iframe) {
      return;
    }

    iframe.onload = () => {
      iframe.contentWindow?.postMessage({ themeMode: actualTheme }, '*');
      iframe.contentWindow?.postMessage({ lang: i18n.language }, '*');
    };
  }, [actualTheme, homePageContent, i18n.language, shouldRenderCustomContent]);

  if (shouldRenderCustomContent) {
    return (
      <div className='overflow-x-hidden w-full'>
        {homePageContent.startsWith('https://') ? (
          <iframe
            src={homePageContent}
            className='w-full h-screen border-none'
            title='custom-home-page'
          />
        ) : (
          <div
            className='mt-[60px]'
            dangerouslySetInnerHTML={{ __html: homePageContent }}
          />
        )}
      </div>
    );
  }

  return (
    <div className='landing-shell'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      <div className='landing-aurora landing-aurora-left' />
      <div className='landing-aurora landing-aurora-right' />
      <div className='landing-grid-glow' />

      <section className='landing-container landing-hero'>
        <div className='landing-hero-grid'>
          <div className='landing-hero-copy'>
            <div className='landing-eyebrow'>
              <span className='landing-eyebrow-dot' />
              {systemName}
              <span className='landing-eyebrow-divider' />
              {t('统一大模型接口网关')}
            </div>

            <h1 className='landing-title'>
              {t('把 AI 接入做成')}
              <br />
              <span>{t('稳定可售卖的基础设施')}</span>
            </h1>

            <p className='landing-subtitle'>
              {t(
                '保留你熟悉的 OpenAI 兼容调用方式，同时把渠道聚合、稳定性和商业化展示一起往前推进。',
              )}
            </p>

            <div className='landing-feature-list'>
              {featureItems.map((item) => (
                <div key={item.title} className='landing-feature-item'>
                  <div className='landing-feature-icon'>{item.icon}</div>
                  <div>
                    <div className='landing-feature-title'>{item.title}</div>
                    <div className='landing-feature-description'>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='landing-cta-row'>
              <Link to='/console'>
                <Button
                  theme='solid'
                  type='primary'
                  size={isMobile ? 'default' : 'large'}
                  className='landing-primary-button'
                >
                  <span>{t('进入控制台')}</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <Button
                theme='borderless'
                size={isMobile ? 'default' : 'large'}
                className='landing-secondary-button'
                onClick={handleCopyBaseURL}
              >
                <CopyIcon size={16} />
                <span>{t('复制 Base URL')}</span>
              </Button>
            </div>

            <div className='landing-trust-row'>
              <span>{t('适合多渠道聚合')}</span>
              <span>{t('适合企业自用')}</span>
              <span>{t('适合 API 售卖')}</span>
            </div>
          </div>

          <div className='landing-command-card'>
            <div className='landing-command-header'>
              <div>
                <div className='landing-card-label'>{t('接入面板')}</div>
                <div className='landing-card-title'>
                  {t('一分钟完成首个请求')}
                </div>
              </div>
              <div className='landing-card-status'>{t('在线')}</div>
            </div>

            <div className='landing-command-block'>
              <div className='landing-command-meta'>{t('Base URL')}</div>
              <div className='landing-command-url'>{serverAddress}</div>
            </div>

            <div className='landing-endpoint-list'>
              {activeEndpoints.map((endpoint, index) => (
                <div
                  key={endpoint}
                  className={`landing-endpoint-row ${index === endpointIndex ? 'is-active' : ''}`}
                >
                  <span>{endpoint}</span>
                  <ChevronRight size={14} />
                </div>
              ))}
            </div>

            <div className='landing-code-preview'>
              <div className='landing-code-label'>{t('请求示例')}</div>
              <code>
                {`POST ${serverAddress}${activeEndpoint}\nAuthorization: Bearer sk-***`}
              </code>
            </div>

            <div className='landing-capability-grid'>
              {capabilityRows.map((row) => (
                <div key={row.title} className='landing-capability-cell'>
                  <div className='landing-capability-icon'>{row.icon}</div>
                  <div>
                    <div className='landing-capability-title'>{row.title}</div>
                    <div className='landing-capability-value'>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='landing-container landing-provider-section'>
        <div className='landing-section-heading'>
          <div className='landing-section-kicker'>{t('兼容生态')}</div>
          <h2>{t('延续熟悉的调用方式，接更多模型')}</h2>
          <p>
            {t(
              '保持接入层尽可能简单，让渠道切换、价格策略和上游扩容留在网关侧完成。',
            )}
          </p>
        </div>

        <div className='landing-provider-cloud'>
          {providerItems.map((item) => (
            <div key={item.label} className='landing-provider-chip'>
              <div className='landing-provider-icon'>{item.icon}</div>
              <Text className='landing-provider-label'>{item.label}</Text>
            </div>
          ))}
        </div>
      </section>

      <section className='landing-container landing-advantage-section'>
        <div className='landing-section-heading'>
          <div className='landing-section-kicker'>{t('面向业务')}</div>
          <h2>{t('不是展示型首页，而是带转化意图的网关首页')}</h2>
        </div>

        <div className='landing-advantage-strip'>
          <div className='landing-advantage-item'>
            <span>{t('1')}</span>
            <div>
              <h3>{t('首屏直接指向接入动作')}</h3>
              <p>{t('减少信息噪音，让用户先进入控制台或直接复制接入地址。')}</p>
            </div>
          </div>
          <div className='landing-advantage-item'>
            <span>{t('2')}</span>
            <div>
              <h3>{t('视觉上更像稳定的基础设施')}</h3>
              <p>
                {t(
                  '深色背景、冷蓝高光和命令面板式布局，会更接近企业级 AI 服务气质。',
                )}
              </p>
            </div>
          </div>
          <div className='landing-advantage-item'>
            <span>{t('3')}</span>
            <div>
              <h3>{t('为售卖 API 预留商业感')}</h3>
              <p>
                {t(
                  '后续再接套餐、优惠和渠道说明时，这套版式更容易继续往上叠。',
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='landing-container landing-final-cta'>
        <div className='landing-final-panel'>
          <div>
            <div className='landing-section-kicker'>{t('下一步')}</div>
            <h2>{t('先把站点首页和接入动作跑顺，再继续补套餐和支付')}</h2>
          </div>

          <div className='landing-final-actions'>
            <Link to='/console'>
              <Button
                theme='solid'
                type='primary'
                size={isMobile ? 'default' : 'large'}
                className='landing-primary-button'
              >
                {t('打开控制台')}
              </Button>
            </Link>
            <Button
              theme='borderless'
              size={isMobile ? 'default' : 'large'}
              className='landing-secondary-button'
              onClick={handleCopyBaseURL}
            >
              {t('复制接入地址')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
