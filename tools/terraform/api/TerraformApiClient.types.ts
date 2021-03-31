export interface TerraformResponse<T> {
  data: T;
}

export interface TerraformVariableAttribute {
  key: string;
  value: string;
  description: string;
  sensitive: boolean;
  hcl: boolean;
}

export interface TerraformVariable {
  id: string;
  type: 'vars';
  attributes: TerraformVariableAttribute;
}
