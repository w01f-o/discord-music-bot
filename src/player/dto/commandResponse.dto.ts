export class CommandResponseDto {
  private readonly _response: string;
  private readonly _description: string;

  constructor(response: string, description?: string) {
    this._response = response;
    this._description = description;
  }

  get response(): string {
    return this._response;
  }

  get description(): string {
    return this._description;
  }
}
