const DASHBOARD = {
  text: '系统概览',
  translate: 'sidebar.nav.DASHBOARD',
  link: '/dashboard',
  icon: 'performance',
};
const NETWORK_ACTIVITY = {
  text: '网络操作',
  translate: 'sidebar.nav.NETWORK_ACTIVITY',
  link: '/graph',
  icon: 'neural_network',
};
const ASSETS = {
  text: '系统资产',
  translate: 'sidebar.nav.RESOURCE',
  icon: 'products',
  submenu: [
    {
      text: '平台',
      translate: 'scan.PLATFORM',
      link: '/platforms',
    },
    {
      text: '命名空间',
      translate: 'sidebar.nav.NAMESPACES',
      link: '/domains',
    },
    {
      text: '主机节点',
      translate: 'sidebar.nav.NODES',
      link: '/hosts',
    },
    {
      text: '容器',
      translate: 'sidebar.nav.CONTAINERS',
      link: '/workloads',
    },
    {
      text: '镜像库',
      translate: 'sidebar.nav.REG_SCAN',
      link: '/regScan',
    },
   /** 
    {
      text: 'Sigstore Verifiers',
      translate: 'sidebar.nav.SIGSTORE_VERIFIERS',
      link: '/signature-verifiers',
    },**/
    {
      text: '系统组件',
      translate: 'sidebar.nav.SYSTEM_COMPONENTS',
      link: '/controllers',
    },
  ],
};
const POLICY = {
  text: '系统策略',
  translate: 'sidebar.nav.SECURITY',
  icon: 'policy',
  submenu: [
    {
      text: '准入控制',
      translate: 'sidebar.nav.ADMISSION_CONTROL',
      link: '/admission-control',
    },
    {
      text: '安全组',
      translate: 'sidebar.nav.GROUP',
      link: '/group',
    },
    {
      text: '网络规则',
      translate: 'sidebar.nav.POLICY',
      link: '/policy',
    },
    {
      text: '响应规则',
      translate: 'sidebar.nav.RESPONSE_POLICY',
      link: '/response-policy',
    },
    /** 
    {
      text: 'DLP Sensors',
      translate: 'sidebar.nav.DLP_SENSORS',
      link: '/dlp-sensors',
    },
    {
      text: 'WAF Sensors',
      translate: 'sidebar.nav.WAF_SENSORS',
      link: '/waf-sensors',
    },**/

  ],
};
const SECURITY_RISKS = {
  text: '安全漏洞',
  translate: 'sidebar.nav.RISK',
  icon: 'critical_bug',
  submenu: [
    {
      text: '漏洞',
      translate: 'sidebar.nav.SCAN',
      link: '/scan',
    },
    {
      text: '过滤',
      translate: 'cveProfile.TITLE',
      link: '/cveProfile',
    },
    {
      text: '基线检车',
      translate: 'sidebar.nav.BENCH',
      link: '/bench',
    },
/*
    {
      text: 'Compliance Profile',
      translate: 'cis.COMPLIANCE_PROFILE',
      link: '/cisProfile',
    },
*/
  ],
};
const NOTIFICATIONS = {
  text: '事件通知',
  translate: 'sidebar.nav.NOTIFICATIONS',
  icon: 'notifications_none',
  submenu: [
    {
      text: '安全事件',
      translate: 'sidebar.nav.SECURITY_EVENT',
      link: '/security-event',
    },
    {
      text: '风险事件',
      translate: 'sidebar.nav.AUDIT',
      link: '/audit',
    },
    {
      text: '系统事件',
      translate: 'sidebar.nav.EVENT',
      link: '/event',
    },
  ],
};
const SETTINGS = {
  text: '系统设置',
  translate: 'sidebar.nav.SETTING',
  link: '/settings',
  icon: 'settings_suggest',
};

export const menu = [
  DASHBOARD,
  NETWORK_ACTIVITY,
  ASSETS,
  POLICY,
  SECURITY_RISKS,
  NOTIFICATIONS,
  SETTINGS,
];
