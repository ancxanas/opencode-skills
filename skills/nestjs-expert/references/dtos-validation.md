------
{% raw %}
-----|---------|
| `@IsString()` | String type |
| `@IsEmail()` | Valid email |
| `@MinLength(n)` | Min string length |
| `@IsInt()`, `@Min(n)` | Integer validation |
| `@IsEnum(Enum)` | Enum value |
| `@IsOptional()` | Optional field |
| `@ValidateNested()` | Validate nested object |
| `@Type(() => Class)` | Transform to class |
| `@Transform()` | Custom transform |
| `PartialType()` | All fields optional |
| `OmitType()` | Exclude fields |
| `PickType()` | Include only fields |
{% endraw %}
