#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
验证GitHub Actions部署配置
"""

import json
import os
import subprocess
import time
from datetime import datetime

def check_git_status():
    """检查Git状态"""
    try:
        result = subprocess.run(
            ["git", "log", "--oneline", "-1"],
            capture_output=True,
            text=True,
            cwd="G:\\CherryFarm\\openclaw"
        )
        last_commit = result.stdout.strip()
        return {"status": "正常", "最后提交": last_commit}
    except Exception as e:
        return {"status": "错误", "错误": str(e)}

def check_workflow_file():
    """检查workflow文件"""
    workflow_path = "G:\\CherryFarm\\openclaw\\.github\\workflows\\deploy-vercel.yml"
    if os.path.exists(workflow_path):
        with open(workflow_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        checks = {
            "文件存在": True,
            "触发分支": "master" in content,
            "使用self-hosted": "self-hosted" in content,
            "Windows标签": "windows" in content,
            "Cocos标签": "cocos" in content,
            "Cocos构建步骤": "npm run build:web-mobile" in content,
            "Vercel部署": "vercel deploy" in content
        }
        
        return {"status": "正常", "检查结果": checks}
    else:
        return {"status": "错误", "错误": "workflow文件不存在"}

def check_package_json():
    """检查package.json"""
    package_path = "G:\\CherryFarm\\openclaw\\package.json"
    if os.path.exists(package_path):
        with open(package_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        checks = {
            "文件存在": True,
            "有build脚本": "scripts" in data and "build:web-mobile" in data.get("scripts", {}),
            "项目名称": data.get("name", "未知"),
            "Cocos Creator版本": data.get("cocosCreator", "未知")
        }
        
        return {"status": "正常", "检查结果": checks}
    else:
        return {"status": "警告", "错误": "package.json不存在"}

def main():
    print("=" * 60)
    print("GitHub Actions部署配置验证")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    print("\n1. Git状态检查:")
    git_status = check_git_status()
    for key, value in git_status.items():
        print(f"   {key}: {value}")
    
    print("\n2. Workflow文件检查:")
    workflow_status = check_workflow_file()
    if workflow_status["status"] == "正常":
        print(f"   状态: {workflow_status['status']}")
        for check, result in workflow_status["检查结果"].items():
            symbol = "✅" if result else "❌"
            print(f"   {symbol} {check}")
    else:
        print(f"   状态: {workflow_status['status']}")
        print(f"   错误: {workflow_status['error']}")
    
    print("\n3. Package.json检查:")
    package_status = check_package_json()
    if package_status["status"] == "正常":
        print(f"   状态: {package_status['status']}")
        for check, result in package_status["检查结果"].items():
            if isinstance(result, bool):
                symbol = "✅" if result else "❌"
                print(f"   {symbol} {check}")
            else:
                print(f"   {check}: {result}")
    else:
        print(f"   状态: {package_status['status']}")
        print(f"   错误: {package_status['error']}")
    
    print("\n" + "=" * 60)
    print("验证完成")
    print("=" * 60)
    
    print("\n🎯 下一步:")
    print("1. 访问 https://github.com/goldland2021/Lobby/actions")
    print("2. 查看最新的workflow运行状态")
    print("3. 如果失败，查看详细错误日志")
    print("4. 如果成功，访问Vercel部署的URL")
    
    print("\n⏰ Workflow预计执行时间:")
    print("- 完整构建: 5-10分钟")
    print("- Cocos构建: 2-3分钟")
    print("- Vercel部署: 1-2分钟")

if __name__ == "__main__":
    main()