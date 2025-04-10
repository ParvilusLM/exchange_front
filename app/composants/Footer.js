'use client'
import React from "react";
import { Layout, Typography } from "antd";
import Link from "next/link";

const { Footer } = Layout;
const { Text } = Typography;

function AppFooter() {
  return (
    <Footer style={{ textAlign: "center", backgroundColor: "#f0f2f5", padding: "16px 24px" }}>
      <Text>
        Projet Open Source créé par <strong>Parvilus Love Marckendy</strong>.{" "}
        <Link href="https://github.com/ParvilusLM" target="_blank" rel="noopener noreferrer">
          Voir sur GitHub
        </Link>
      </Text>
    </Footer>
  );
}

export default AppFooter;