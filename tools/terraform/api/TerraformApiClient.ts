import fetch from 'node-fetch';
import { bearer } from '@skryba/shared';
import {
  TerraformResponse,
  TerraformVariable,
} from './TerraformApiClient.types';

export class TerraformApiClient {
  private static readonly baseUrl = 'https://app.terraform.io/api/v2';

  constructor(
    private readonly workspaceId: string,
    private readonly token: string
  ) {}

  async listVariables(): Promise<TerraformResponse<TerraformVariable[]>> {
    const response = await fetch(
      `${TerraformApiClient.baseUrl}/workspaces/${this.workspaceId}/vars`,
      {
        headers: {
          Authorization: bearer(this.token),
          'Content-Type': 'application/vnd.api+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch variables.');
    }

    return response.json();
  }

  async updateVariable(variable: TerraformVariable) {
    const response = await fetch(
      `${TerraformApiClient.baseUrl}/workspaces/${this.workspaceId}/vars/${variable.id}`,
      {
        headers: {
          Authorization: bearer(this.token),
          'Content-Type': 'application/vnd.api+json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          data: variable,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update variable.');
    }
  }
}
