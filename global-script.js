// Define main function (script entry)

// 规则集通用配置
const ruleProviderCommon = {
  type: "http",
  format: "yaml",
  interval: 86400,
};

// 规则集配置
const ruleProviders = {
  "my-direct": {
    ...ruleProviderCommon,
    behavior: "domain",
    url: "https://raw.githubusercontent.com/hellonone/my-clash-rule/refs/heads/main/direct.txt",
    path: "./ruleset/my-clash-rule/direct.yaml",
  },
  "my-proxy": {
    ...ruleProviderCommon,
    behavior: "domain",
    url: "https://raw.githubusercontent.com/hellonone/my-clash-rule/refs/heads/main/proxy.txt",
    path: "./ruleset/my-clash-rule/proxy.yaml",
  },
};

// 规则
const rules = [
  // 自定义规则
  "IP-CIDR6,::/0,DIRECT",
  "RULE-SET,my-direct,DIRECT",
  "RULE-SET,my-proxy,PROXY",
];

// 代理组通用配置
const groupBaseOption = {
  interval: 300,
  timeout: 3000,
  url: "https://www.google.com/generate_204",
  lazy: true,
  "max-failed-times": 3,
  hidden: false,
};

function main(config) {
  // 覆盖原配置中的规则
  config["rule-providers"] = ruleProviders;
  rules.push(...config["rules"]);
  config["rules"] = rules;

  // 融合原配置中的代理组
  // 获取订阅中的第一个
  const proxyName =
    config["proxy-groups"] && config["proxy-groups"][0]
      ? config["proxy-groups"][0].name
      : "";
  const proxiesMy = proxyName ? [proxyName, "catchProxy"] : ["catchProxy"];

  const catchProxy = [
    {
      name: "Proxy_http抓包",
      server: "127.0.0.1",
      port: 9000,
      type: "http",
    },
    {
      name: "Proxy_socks5抓包",
      server: "127.0.0.1",
      port: 9000,
      type: "socks5",
    },
  ];

  // const lProxys = [...config["proxies"], ...catchProxy];
  
  // config["proxies"] = lProxys;

  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      name: "PROXY",
      type: "select",
      proxies: proxiesMy,
      "include-all": true,
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
    },

    // {
    //   name: "catchProxy",
    //   type: "select",
    //   proxies: ["Proxy_socks5抓包", "Proxy_http抓包"],
    // },
    ...config["proxy-groups"],
  ];
  // 返回修改后的配置
  return config;
}
