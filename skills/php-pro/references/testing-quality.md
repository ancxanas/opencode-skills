------
{% raw %}
|---------|---------|
| PHPUnit | Unit/Feature tests | `./vendor/bin/phpunit` |
| Pest | Modern testing | `./vendor/bin/pest` |
| PHPStan | Static analysis | `./vendor/bin/phpstan analyse` |
| Psalm | Alternative static analysis | `./vendor/bin/psalm` |
| PHP-CS-Fixer | Code style | `./vendor/bin/php-cs-fixer fix` |
| PHPMD | Mess detector | `./vendor/bin/phpmd src text cleancode` |

| Assertion | PHPUnit | Pest |
|-----------|---------|------|
| Equality | `$this->assertSame()` | `expect()->toBe()` |
| Type | `$this->assertInstanceOf()` | `expect()->toBeInstanceOf()` |
| Array | `$this->assertContains()` | `expect()->toContain()` |
| Exception | `$this->expectException()` | `expect()->toThrow()` |
| Count | `$this->assertCount()` | `expect()->toHaveCount()` |

{% endraw %}
