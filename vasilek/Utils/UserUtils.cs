using System;

namespace vasilek.Utils
{
    public static class UserUtils
    {
        public static string GenerateNickColor()
        {
            Random random = new Random();
            switch (random.Next(1, 10))
            {
                case 1:
                    return "#ef5777";
                case 2:
                    return "#575fcf";
                case 3:
                    return "#4bcffa";
                case 4:
                    return "#34e7e4";
                case 5:
                    return "#0be881";
                case 6:
                    return "#ffc048";
                case 7:
                    return "#f7b731";
                case 8:
                    return "#ff5e57";
                case 9:
                    return "#20bf6b";
                case 10:
                    return "#2bcbba";
                default:
                    return "black";
            }
        }
    }
}
