using System.Text;

namespace JVerbsDataConverter
{
    internal static class VerbConverter
    {
        private static readonly string[] _columnList = new string[]
        {
            "inf-dict",
            "inf-neg",
            "inf-neg-past",
            "inf-te",
            "inf-ta",
            "form-masu",
            "form-neg",
            "form-neg-past",
        };

        public static string ValidateInputData(InputData input)
        {
            var error = new StringBuilder();

            if (string.IsNullOrEmpty(input.Group))
                error.Append("Group is required; ");
            if (string.IsNullOrEmpty(input.Text))
                error.Append("Text is required; ");
            if (string.IsNullOrEmpty(input.Kana))
                error.Append("Kana is required; ");

            return error.ToString();
        }

        public static string MakeResult(InputData input)
        {
            var sb = new StringBuilder();

            var textData = input.Text.Split(";");
            var kanaData = input.Kana.Split(";");

            sb.Append("{");

            sb.Append($"\"group\": \"{input.Group.Trim().ToLower()}\",");
            sb.Append($"\"tags\": \"{input.Tag.Trim().ToLower()}\",");

            sb.Append("\"columns\": {");

            sb.Append($"\"eng\": \"{textData[0].Trim().ToLower()}\",");
            sb.Append($"\"inf-kanji\": \"{input.Kanji.Trim()}\",");

            for (int i = 0; i < _columnList.Length; i++)
            {
                sb.Append($"\"{_columnList[i]}\": {{");

                sb.Append($"\"kana\": \"{kanaData[i].Trim()}\",");
                sb.Append($"\"romaji\": \"{textData[i + 1].Trim()}\"");

                sb.Append((i < _columnList.Length - 1) ? "}," : "}");
            }

            sb.Append("}");

            sb.Append("}");

            return sb.ToString();
        }

    }

    internal record InputData
    {
        public string Group { get; set; }
        public string Tag { get; set; } = "";
        public string Text { get; set; }
        public string Kana { get; set; }
        public string Kanji { get; set; }
    }
}
