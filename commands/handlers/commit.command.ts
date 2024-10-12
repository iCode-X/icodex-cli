import { Command } from "commander";
import { AbstractCommand } from "../abstract.command";

/**
 * TODO
 * 1. AI 生成 commit 消息
 *    commit gen：使用 AI 分析 Git 暂存区内容并生成 commit message。
 * 2. 扫描并发送通知
 *    commit notify --types FIXME：扫描代码中的 FIXME 注释并发送通知。
 *    commit notify --types TODO：扫描代码中的 TODO 注释并发送通知。
 */
export class CommitCommand extends AbstractCommand {
  public async load(program: Command): Promise<void> {
    program
      .command("commit <action>")
      .alias("cm")
      .description(await this.buildDescription())
      .action(async (action) => {});
  }

  protected buildDescription(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
